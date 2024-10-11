using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class GruposEntidadeMapper : IEntityTypeConfiguration<GruposEntidade>
    {
        public void Configure(EntityTypeBuilder<GruposEntidade> builder)
        {
            builder.ToTable("tb_grupos").HasKey(i => i.IdGrupo);
            builder.Property(x => x.IdGrupo).HasColumnName("idgrupo").IsRequired();
            builder.Property(x => x.Nome).HasColumnName("nome").IsRequired().HasColumnType("varchar(50)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasMany(x => x.Permissoes)
                .WithOne(x => x.Grupo)
                .HasForeignKey(x => x.IdGrupo)
                .HasConstraintName("grupo_permissoes");

            builder.HasMany(x => x.Usuarios)
                .WithOne(x => x.Grupo)
                .HasForeignKey(x => x.IdGrupo)
                .HasConstraintName("grupo_usuarios");

        }
    }
}