using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class ProjetoJaTemContratoExistenteError : Error
    {
        public ProjetoJaTemContratoExistenteError(string message)
        {
            Message = message ?? "Projeto já tem contrato existente";
        }
    }
}