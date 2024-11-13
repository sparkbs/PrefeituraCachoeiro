using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class MedicaoNaoPodeSerAprovadaError : Error
    {
        public MedicaoNaoPodeSerAprovadaError(string message)
        {
            Message = message ?? "A medição não pode ser aprovada";
        }
    }
}