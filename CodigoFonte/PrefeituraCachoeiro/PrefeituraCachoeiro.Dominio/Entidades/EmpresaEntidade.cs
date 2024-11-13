namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class EmpresaEntidade : EntidadeBase
    {
        public int EmpresaId {get;set;}
        public string Nome { get; set; }
        public string Logo { get; set; }
        public List<ContratosEntidade> Contratos { get; set; }

        public EmpresaEntidade(): base()
        {

        }

        public EmpresaEntidade(string nome, string logo): base()
        {
            this.Nome = nome;
            this.Logo = logo;
        }
    }
}