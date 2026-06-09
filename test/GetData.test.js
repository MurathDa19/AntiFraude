const { isTableFraudulent } = require('./GetData');

describe('--- TESTS DE FUNCIONALIDAD ---', () => {

  test('Verifica si un formulario E-14 tiene fraude electoral', () => {
    
    const mockFraudForm = {
      candidate_a_votes: 150,
      candidate_b_votes: 120,
      blank_votes: 40,
      null_votes: 20,
      poling_tables: { registered_voters: 300 },
    };
    expect(isTableFraudulent(mockFraudForm)).toBe(true);
  });

  test('Verifica si un formulario E-14 no tiene fraude electoral', () => {
    const mockCleanForm = {
      candidate_a_votes: 80,
      candidate_b_votes: 50,
      blank_votes: 10,
      null_votes: 5,
      poling_tables: { registered_voters: 200 },
    };
    expect(isTableFraudulent(mockCleanForm)).toBe(false);
  });

});
