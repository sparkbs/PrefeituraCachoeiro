using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class MedicaoNaoPodeSerAlteradaError : Error
    {
        public MedicaoNaoPodeSerAlteradaError(string message)
        {
            Message = message ?? "A medição não pode ser alterada";
        }
    }
}