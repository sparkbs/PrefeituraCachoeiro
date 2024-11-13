namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public abstract class EntidadeBase
    {
        public DateTime DataCriacao { get; private set; }
        public DateTime? DataDelecao { get; set; }

        public EntidadeBase()
        {
            this.Create();
        }

        public void Create()
        {
            DataCriacao = DateTime.UtcNow;
        }

        public void Delete()
        {
            DataDelecao = DateTime.Now.ToUniversalTime();
        }
    }
}