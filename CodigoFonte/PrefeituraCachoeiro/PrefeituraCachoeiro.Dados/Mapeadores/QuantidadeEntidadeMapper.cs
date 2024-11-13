using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class QuantidadeEntidadeMapper : IEntityTypeConfiguration<QuantidadeEntidade>
    {
        public void Configure(EntityTypeBuilder<QuantidadeEntidade> builder)
        {
            builder.ToTable("tb_quantidade").HasKey(i => i.IdQuantidade);
            builder.Property(x => x.IdQuantidade).HasColumnName("idquantidade").IsRequired();
            builder.Property(x => x.Nome).HasColumnName("nome").IsRequired().HasColumnType("varchar(10)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasMany(x => x.ItemsQuantidade)
                   .WithOne(x => x.Quantidade)
                   .HasForeignKey(x => x.QuantidadeId)
                   .HasConstraintName("fk_quantidade_items_entidade");

            builder.HasMany(x => x.ItemsContrato)
                   .WithOne(x => x.Quantidade)
                   .HasForeignKey(x => x.QuantidadeId)
                   .HasConstraintName("fk_items_contrato_quantidade");
        }
    }
}