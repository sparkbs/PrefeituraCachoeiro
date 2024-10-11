namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ProjetoEntidade: EntidadeBase
    {
        public int IdProjeto { get; set; }
        public string? NomeProjeto { get; set; }
        public List<ContratosEntidade> Contratos { get; set; }

        public ProjetoEntidade(): base()
        {

        }

        public ProjetoEntidade(string nomeProjeto): this()
        {
            this.NomeProjeto = nomeProjeto;
        }
    }
}