using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class ValorUnidadeInformadoExcedeLimitePermitidoError : Error
    {
        public ValorUnidadeInformadoExcedeLimitePermitidoError(string message)
        {
            Message = message ?? "O valor informado para o item de medição excede o limite permitido";
        }
    }
}