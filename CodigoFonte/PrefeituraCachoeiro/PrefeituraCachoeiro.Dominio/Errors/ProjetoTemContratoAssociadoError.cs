using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class ProjetoTemContratoAssociadoError : Error
    {
        public ProjetoTemContratoAssociadoError(string message)
        {
            Message = message ?? "Projeto não pode ser removido";
        }
    }
}