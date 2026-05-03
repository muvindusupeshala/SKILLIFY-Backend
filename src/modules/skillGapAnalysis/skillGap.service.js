function analyzeGapForCareer(scores, career) {
  const gaps = career.requiredSkills.map((required) => {
    const currentLevel = Number(scores[required.name] || 0);
    const gapLevel = Math.max(0, required.level - currentLevel);

    return {
      skill: required.name,
      currentLevel,
      requiredLevel: required.level,
      gapLevel,
      status: gapLevel === 0 ? 'met' : 'needs-improvement',
      progress: required.level ? Math.round((currentLevel / required.level) * 100) : 0,
    };
  });

  const metCount = gaps.filter((gap) => gap.gapLevel === 0).length;
  const readiness = gaps.length ? Math.round((metCount / gaps.length) * 100) : 0;
  const lackingSkills = gaps.filter((gap) => gap.gapLevel > 0).map((gap) => gap.skill);

  return {
    careerId: career.id,
    careerTitle: career.title,
    readiness,
    metCount,
    totalSkills: gaps.length,
    lackingSkills,
    gaps,
  };
}

module.exports = { analyzeGapForCareer };