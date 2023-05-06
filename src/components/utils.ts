export const DefaultProfileImage = (giveName: string, familyName: string) => {
  const InitialsColors = {
    abcde: '#433555',
    fghijk: '#23ab23',
    lmnop: '#42524b',
    qrstu: '#f0524b',
    vwxyz: '#a3524b',
  };
  const name = `${giveName} ${familyName}`;
  const firstNameInitials = name[0][0] ? name[0][0].toUpperCase() : '';
  const lastNameInitials = name[1][0]
    ? name[1][0].toUpperCase()
    : name[0][1].toUpperCase();
  const initials = firstNameInitials + lastNameInitials;
  const match = Object.keys(InitialsColors).find(element =>
    element.includes(firstNameInitials?.toLowerCase() || 'a'),
  );
  return {initials, match: InitialsColors[match]};
};
