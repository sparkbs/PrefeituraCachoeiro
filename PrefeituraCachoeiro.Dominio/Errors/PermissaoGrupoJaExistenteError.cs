using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class PermissaoGrupoJaExistenteError : Error
    {
        public PermissaoGrupoJaExistenteError(string message)
        {
            Message = message ?? "O tipo de permissão informada já está associada ao grupo informado";
        }
    }
}