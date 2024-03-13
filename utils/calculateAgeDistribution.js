export default function calculateAgeDistribution(users) {
  let ageGroups = {
    "< 20": 0,
    "20 to 40": 0,
    "40 to 60": 0,
    "> 60": 0,
  };
  let totalUsers = users.length;

  users.forEach((user) => {
    if (user.age < 20) {
      ageGroups["< 20"]++;
    } else if (user.age >= 20 && user.age <= 40) {
      ageGroups["20 to 40"]++;
    } else if (user.age > 40 && user.age <= 60) {
      ageGroups["40 to 60"]++;
    } else {
      ageGroups["> 60"]++;
    }
  });

  // Calculate percentage distribution
  for (let key in ageGroups) {
    ageGroups[key] = ((ageGroups[key] / totalUsers) * 100).toFixed(2);
  }

  return ageGroups;
}
