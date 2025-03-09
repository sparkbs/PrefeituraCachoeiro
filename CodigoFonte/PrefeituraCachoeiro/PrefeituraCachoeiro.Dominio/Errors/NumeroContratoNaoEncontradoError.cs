using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class NumeroContratoNaoEncontradoError : Error
    {
        public NumeroContratoNaoEncontradoError(string message)
        {
            Message = message ?? "O número do contrato informado não foi encontrado";
        }
    }
}
