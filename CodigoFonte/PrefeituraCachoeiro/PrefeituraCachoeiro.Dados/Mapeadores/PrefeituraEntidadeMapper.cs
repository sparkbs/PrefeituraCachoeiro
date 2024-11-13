using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class PrefeituraEntidadeMapper : IEntityTypeConfiguration<PrefeituraEntidade>
    {
        public void Configure(EntityTypeBuilder<PrefeituraEntidade> builder)
        {
            builder.ToTable("tb_prefeitura").HasKey(i => i.IdPrefeitura);
            builder.Property(x => x.IdPrefeitura).HasColumnName("idPrefeitura").IsRequired();
            builder.Property(x => x.Nome).HasColumnName("nome").HasColumnType("varchar(200)").IsRequired();
            builder.Property(x => x.Logo).HasColumnName("logo").HasColumnType("varchar(5000)").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao").IsRequired(false);

            builder.HasMany(x => x.Contratos)
                   .WithOne(x => x.Prefeitura)
                   .HasForeignKey(x => x.PrefeituraId)
                   .HasConstraintName("fk_prefeituas_contratos");
        }
    }
}