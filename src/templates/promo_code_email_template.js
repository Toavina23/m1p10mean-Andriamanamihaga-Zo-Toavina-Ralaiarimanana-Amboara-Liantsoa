const PROMO_CODE_TEMPLATE = (code, reduction, endDate) => {
	return `
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Promo Beauty Salon</title>
</head>

<body>
    <p>
        Bonjour, nous vous informons de notre nouvelle offre spéciale avec le code promo: <b>${code}</b>.
    </p>
    <p>
        Profitez d'une réduction à <b>${reduction}%</b>. Offre valide jusqu'au ${endDate}. 
    </p>
</body>

</html>
    `;
};
module.exports = PROMO_CODE_TEMPLATE;