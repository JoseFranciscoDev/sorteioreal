function verificarCnpj(documento) {
    if (!documento) return false;

    if (String(documento).includes('/')) {
        return true;
    }
    if (String(documento).length > 14) {
        return true
    }
    return false;
}

module.exports = verificarCnpj;
