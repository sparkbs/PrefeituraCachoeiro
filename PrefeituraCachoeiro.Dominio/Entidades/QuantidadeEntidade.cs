namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class QuantidadeEntidade: EntidadeBase
    {
        public int IdQuantidade { get; set; }
        public string? Nome { get; set; }
        public List<ItemEntidade> ItemsQuantidade { get; set; }
        public List<ItemsContratoEntidade> ItemsContrato { get; set; }
    }
}