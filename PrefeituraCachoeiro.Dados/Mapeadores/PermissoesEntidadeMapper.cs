using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class PermissoesEntidadeMapper : IEntityTypeConfiguration<PermissoesEntidade>
    {
        public void Configure(EntityTypeBuilder<PermissoesEntidade> builder)
        {
            builder.ToTable("tb_permissoes").HasKey(i => i.IdPermissao);
            builder.Property(x => x.IdPermissao).HasColumnName("idpermissao").IsRequired();
            builder.Property(x => x.IdTipoPermissao).HasColumnName("idtipopermissao").IsRequired();
            builder.Property(x => x.IdGrupo).HasColumnName("idgrupo").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
        }
    }
}