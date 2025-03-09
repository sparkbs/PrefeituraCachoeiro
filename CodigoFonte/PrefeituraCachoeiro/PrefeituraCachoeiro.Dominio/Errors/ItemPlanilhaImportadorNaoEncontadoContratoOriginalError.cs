using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class ItemPlanilhaImportadorNaoEncontadoContratoOriginalError : Error
    {
        public ItemPlanilhaImportadorNaoEncontadoContratoOriginalError(string message)
        {
            Message = message ?? "O item informado na planilha não existe nos items do contrato original";
        }
    }
}