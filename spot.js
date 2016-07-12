var SPOT = {

  spotID: 0,
  statusTimeInterval: 3000, // 3 segundos

  /*
   * Tipos de dados enumerados para leitura adequada no código
   */

  enumSpotStatus: {
    // Pending evaluation
    pending-evaluation: "pending-evaluation",
    bad-parameters: "bad-parameters",

    // Holding
    capacity-not-available:     "capacity-not-available",
    capacity-oversubscribed:    "capacity-oversubscribed",
    price-too-low:              "price-too-low",
    not-scheduled-yet:          "not-scheduled-yet",
    launch-group-constraint:    "launch-group-constraint",
    az-group-constraint:        "az-group-constraint",
    placement-group-constraint: "placement-group-constraint",
    constraint-not-fulfillable: "constraint-not-fulfillable",

    // Pending evaluation/fulfillment-terminal
    schedule-expired:            "schedule-expired",
    canceled-before-fulfillment: "canceled-before-fulfillment",
    bad-parameters:              "bad-parameters",
    system-error:                "system-error",

    // Pending fulfillment
    pending-fulfillment: "pending-fulfillment",

    // Fulfilled
    fulfilled: "fulfilled",

    // Fulfilled-terminal
    request-canceled-and-instance-running:       "request-canceled-and-instance-running",
    marked-for-termination:                      "marked-for-termination",
    instance-terminated-by-price:                "instance-terminated-by-price",
    instance-terminated-by-user:                 "instance-terminated-by-user",
    instance-terminated-no-capacity:             "instance-terminated-no-capacity",
    instance-terminated-capacity-oversubscribed: "instance-terminated-capacity-oversubscribed",
    instance-terminated-launch-group-constraint: "instance-terminated-launch-group-constraint",

  },


  get: function( params ) {
    // params informa qual modelo de máquina deve ser copiado

    // fazer a solicitação REST com os dados fornecidos e outros adicionais
    // que serão colocados no código ou armazenados no BD

    // após a solicitação, monitorar o status
    setTimeout(function(){ SPOT.status(); }, 3000);

    return true;
  },

  status: function() {
    /*
     * Verifica o status. Se estiver OPEN, encerra a execução do código
     * Se NÃO estiver OPEN, agenda para verificar novamente
     */
    setTimeout( function(){ SPOT.status(); }, SPOT.statusTimeInterval );

  },

  close: function() {
    /*
     * Obtem o ID da instância e encerra.
     *
     * Coloquei este método aqui, mas ele exige que o utilizador
     * faça uma chamada a SPOT.close()
     *
     * Se colocarmos em uma classe isolada, o utilizador pode simplesmente
     * chamar a classe para que ela seja executada
     *
     */
    return true;
  },

  log: {

    /*
     * Esta classe trabalho com o acesso ao BD.
     * Podemos facilmente isolá-la em uma classe independete,
     * para se instanciada com uma propriedade de SPOT, da seguinte forma:
     *
     * SPOT.log = require('./DB_log')
     *
     */

    request: function() {
      /*
       * Anota no BD as informações de solicitação do SPOT
       */
      return true;
    },

    changeType: function() {
      /*
       * Anota no BD a mudança de tipo para EC2, e o motivo da mudança
       */
      return true;
    },

    status: function( status ) {
      /*
       * Anota no BD a mudança de status
       */
      return true;
    },

    close: function() {
      /*
       * Anota do BD o fechamento do SPOT/EC2
       */
      return true;
    }
  }


};

/*
 * Para iniciar a solicitação
 * chamar SPOT.get( params )
 *
 * Para encerrar a solicitação
 * chamar SPOT.close()
*/
…
