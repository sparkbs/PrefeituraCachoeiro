namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class PrefeituraEntidade: EntidadeBase
    {
        public int IdPrefeitura { get; set; }
        public string Nome { get; set; }
        public string Logo { get; set; }
        public List<ContratosEntidade> Contratos { get; set; }
        public string Email { get; set; }

        public PrefeituraEntidade() : base()
        {
            this.Create();
        }

        public PrefeituraEntidade(string nome, string logo): this()
        {
            this.Nome = nome;
            this.Logo = logo;
        }
    }
}