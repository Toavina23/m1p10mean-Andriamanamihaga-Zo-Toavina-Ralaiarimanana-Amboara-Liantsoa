const VALIDATION_CODE_TEMPLATE = (code) => {
	return `
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de validation Beauty Salon</title>
</head>

<body>
    <p>
        Bonjour, votre code de vérification email est le suivant <b>${code}</b>.
    </p>
    <p>
        La validité du code est de 5 minutes.
    </p>
</body>

</html>
    `;
};
module.exports = VALIDATION_CODE_TEMPLATE;
