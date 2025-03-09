using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class QuantidadeItemPlanilhaSuperiorMaximoPermitidoImportacaoAditivoError : Error
    {
        public QuantidadeItemPlanilhaSuperiorMaximoPermitidoImportacaoAditivoError(string message)
        {
            Message = message ?? "A quantidade informada para o aditivo é superior ao máximo permitido de 25% sobre a quantidade original do contrato";
        }
    }
}