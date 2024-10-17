namespace PrefeituraCachoeiro.Dominio.Dto
{
    public class ItemsMedicoesProjetoDto
    {
        public int IdItemMedicoesProjeto { get; set; }
        public int IdItemContrato { get; set; }
        public ItemsContratoDto ItemsContrato { get; set; }
        public decimal Unidade { get; set; }
    }
}