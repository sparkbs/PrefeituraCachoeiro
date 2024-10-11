using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class TipoPermissoesEntidadeMapper : IEntityTypeConfiguration<TipoPermissoesEntidade>
    {
        public void Configure(EntityTypeBuilder<TipoPermissoesEntidade> builder)
        {
            builder.ToTable("tb_tipos_permissoes").HasKey(i => i.IdTipoPermissao);
            builder.Property(x => x.IdTipoPermissao).HasColumnName("idtipopermissao").IsRequired();
            builder.Property(x => x.Nome).HasColumnName("nome").IsRequired().HasColumnType("varchar(100)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasMany(x => x.Permissoes)
                .WithOne(x => x.TipoPermissao)
                .HasForeignKey(x => x.IdTipoPermissao)
                .HasConstraintName("tipos_permissoes_permissao");

        }
    }
}