const parseGender = gender => {
  const isString = typeof gender === 'string';
  if (!isString) return;
  const isGender = gender => ['male', 'female', 'other'].includes(gender);
  if (isGender(gender)) return gender;
};

const parseName = name => {
  const isString = typeof name === 'string';
  if (!isString) return;
  return name.trim();
};

const parseNumber = number => {
  const isString = typeof number === 'string';
  if (!isString) return;
  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return;
  }
  return parsedNumber;
};

export const parseFilterParams = query => {
  const { name, gender, maxAge, minAge, maxAvgMark, minAvgMark } = query;

  const parsedName = parseName(name);
  const parsedGender = parseGender(gender);
  const parsedMaxAge = parseNumber(maxAge);
  const parsedMinAge = parseNumber(minAge);
  const parsedMaxAvgMark = parseNumber(maxAvgMark);
  const parsedMinAvgMark = parseNumber(minAvgMark);

  return {
    name: parsedName,
    gender: parsedGender,
    maxAge: parsedMaxAge,
    minAge: parsedMinAge,
    maxAvgMark: parsedMaxAvgMark,
    minAvgMark: parsedMinAvgMark,
  };
};
