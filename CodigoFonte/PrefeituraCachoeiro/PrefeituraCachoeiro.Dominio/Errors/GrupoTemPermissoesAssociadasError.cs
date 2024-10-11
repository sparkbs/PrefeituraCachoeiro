using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class GrupoTemPermissoesAssociadasError : Error
    {
        public GrupoTemPermissoesAssociadasError(string message)
        {
            Message = message ?? "Grupo não pode ser removido";
        }
    }
}