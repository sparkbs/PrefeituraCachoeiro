using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class AditivoNaoPodeSerExcluirError : Error
    {
        public AditivoNaoPodeSerExcluirError(string message)
        {
            Message = message ?? "O aditivo não pode ser excluído";
        }
    }
}