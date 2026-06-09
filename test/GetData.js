/**
 * Determina si un formulario E-14 tiene fraude electoral.
 * Si excede la capacidad máxima registrada de votantes en esa mesa,
 * se considera fraude electoral.
 *
 * @param {Object} form 
 * @returns {boolean} 
 */
const isTableFraudulent = (form) => {
  const totalVotes =
    form.candidate_a_votes +
    form.candidate_b_votes +
    form.blank_votes +
    form.null_votes;

  const maxCapacity = form.poling_tables?.registered_voters || 0;

  return totalVotes > maxCapacity;
};

module.exports = { isTableFraudulent };
