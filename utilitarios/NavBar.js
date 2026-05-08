const { NavBarItems } = require("../routes.json");

class NavBar {
    /**
     * Retorna os módulos da navbar com seus itens agrupados.
     * Módulos sem URL viram dropdown com seus itens.
     * Módulos com URL viram links diretos.
     */
    static getModulos() {
        const itensModulos = NavBarItems.ItensModulos || [];
        return NavBarItems.Modulos.map(modulo => ({
            ...modulo,
            items: itensModulos.filter(item => item.modulo === modulo.nome)
        }));
    }
}

module.exports = NavBar;
