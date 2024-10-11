namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ItemsMedicoesProjetoEntidade: EntidadeBase
    {
        public int IdItemMedicoesProjeto { get; set; }
        public int IdMedicoesProjeto { get; set; }
        public MedicoesProjetoEntidade MedicoesProjeto { get; set; }
        public int IdItemContrato { get; set; }
        public ItemsContratoEntidade ItemsContrato { get; set; }
        public decimal Unidade { get; set; }
    }
}