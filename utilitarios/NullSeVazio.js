function NullSeVazio(obj) {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, v === '' ? null : v])
    );
}
module.exports = NullSeVazio