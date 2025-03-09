using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class ContratoExpirouError : Error
    {
        public ContratoExpirouError(string message)
        {
            Message = message ?? "O contrato informado está expirado";
        }
    }
}