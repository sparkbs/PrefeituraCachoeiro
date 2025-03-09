using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class GrupoTemUsuariosAssociadosError : Error
    {
        public GrupoTemUsuariosAssociadosError(string message)
        {
            Message = message ?? "Grupo não pode ser removido";
        }
    }
}