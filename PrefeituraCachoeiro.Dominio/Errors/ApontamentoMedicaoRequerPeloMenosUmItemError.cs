using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class ApontamentoMedicaoRequerPeloMenosUmItemError : Error
    {
        public ApontamentoMedicaoRequerPeloMenosUmItemError(string message)
        {
            Message = message ?? "O apontamento de uma medição requer pelo menos um item na lista de items";
        }
    }
}