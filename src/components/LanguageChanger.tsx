'use client';

export const LanguageChanger = () => {
  const handleChange = (e: any) => {
    console.log('todo handle change');
  };

  return (
    <select value={'en'} onChange={handleChange}>
      {' '}
      {`//todo:`}
      <option value="en">English</option>
      <option value="fr">Francaise</option>
      <option value="es">Español</option>
      <option value="ja" disabled>
        日本語
      </option>
    </select>
  );
};
