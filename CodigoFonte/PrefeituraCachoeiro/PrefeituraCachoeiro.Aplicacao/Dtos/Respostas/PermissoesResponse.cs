namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class PermissoesResponse
    {
        public int IdPermissao { get; set; }
        public int IdTipoPermissao { get; set; }
        public TiposPermissoesResponse TipoPermissao { get; set; }
    }
}
