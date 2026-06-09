import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kevinitzeuvtobijvzga.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eesjjwwa6NgO3NH8VuXZ0g_JEpALxVa';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchE14Data = async () => {
    setLoading(true);
    try {
      const { data: forms, error } = await supabase
        .from('e14_forms')
        .select(`
          candidate_a_votes,
          candidate_b_votes,
          blank_votes,
          null_votes,
          poling_tables (table_number, registered_voters)
        `);

      if (error) throw error;
      setData(forms || []);
    } catch (error) {
      console.error('Error cargando datos:', error.message);
      Alert.alert('ERROR', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchE14Data();
  }, []);

  const runForensicAudit = () => {
    let fraudCount = 0;

    data.forEach((item) => {
      const totalVotes =
        item.candidate_a_votes +
        item.candidate_b_votes +
        item.blank_votes +
        item.null_votes;
      const maxVoters = item.poling_tables?.registered_voters || 0;
      if (totalVotes > maxVoters) fraudCount++;
    });

    if (fraudCount > 0) {
      Alert.alert(
        'ALERTA',
        `Auditoría completada.\n${fraudCount} mesa(s) con inconsistencias detectadas.\n(Votos registrados > capacidad de la mesa)\n\nPreconteo pausado.`
      );
    } else {
      Alert.alert(
        'OK',
        'Auditoría completada.\nNo se encontraron inconsistencias.'
      );
    }
  };

  const renderTableItem = ({ item }) => {
    const totalVotes =
      item.candidate_a_votes +
      item.candidate_b_votes +
      item.blank_votes +
      item.null_votes;
    const maxVoters = item.poling_tables?.registered_voters || 0;
    const isFraudulent = totalVotes > maxVoters;

    return (
      <View style={[styles.card, isFraudulent && styles.cardAlert]}>
        <Text style={styles.cardLabel}>
          mesa_{item.poling_tables?.table_number} 
        </Text>
        <View style={styles.divider} />
        <Text style={styles.cardRow}>
          votos_totales    <Text style={styles.cardValue}>{totalVotes}</Text>
        </Text>
        <Text style={styles.cardRow}>
          capacidad_legal  <Text style={styles.cardValue}>{maxVoters}</Text>
        </Text>
        <View style={styles.statusRow}>
          <Text style={styles.cardRow}>estado           </Text>
          <Text style={[styles.statusText, isFraudulent ? styles.statusFail : styles.statusOk]}>
            {isFraudulent ? '[ILLEGAL STATE]' : '[LEGAL STATE]'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>

      <View style={styles.header}>
        <Text style={styles.title}>votes-monitor-legacy</Text>
        <Text style={styles.subtitle}>registraduria-api / anti-fraude-monitor v1.0</Text>
      </View>

      <View style={styles.headerDivider} />

      {loading && data.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>fetching data...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTableItem}
          contentContainerStyle={styles.listPadding}
          refreshing={loading}
          onRefresh={fetchE14Data}
        />
      )}

      <TouchableOpacity
        style={styles.auditButton}
        onPress={runForensicAudit}
        activeOpacity={0.7}
      >
        <Text style={styles.auditButtonText}>$ run --forensic-audit</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  subtitle: {
    color: '#666666',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  headerDivider: {
    borderBottomColor: '#2A2A2A',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#0A0A0A',
  },
  cardAlert: {
    borderColor: '#FF4444',
    backgroundColor: '#110000',
  },
  cardLabel: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 1,
  },
  divider: {
    borderBottomColor: '#2A2A2A',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  cardRow: {
    color: '#999999',
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 5,
  },
  cardValue: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusOk: {
    color: '#AAFFAA',
  },
  statusFail: {
    color: '#FF4444',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#666666',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  auditButton: {
    backgroundColor: '#0A0A0A',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  auditButtonText: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});