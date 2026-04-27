const SpcStrategy = require("./SpcStrategy");

class ProcessorFactory {
    static Processor(tipo) {
        const strategies = {
            "spc": new SpcStrategy(),
            "serasa": new SerasaStrategy(),
            "protesto": new ProtestoStrategy()
        }

        return strategies[tipo] || null;
    }
}


module.exports = ProcessorFactory;