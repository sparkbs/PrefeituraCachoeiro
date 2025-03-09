using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class AditivosEntidadeMapper : IEntityTypeConfiguration<AditivosEntidade>
    {
        public void Configure(EntityTypeBuilder<AditivosEntidade> builder)
        {
            builder.ToTable("tb_aditivos").HasKey(i => i.IdAditivo);
            builder.Property(x => x.ContratoId).HasColumnName("contratoid").IsRequired();
            builder.Property(x => x.TipoAditivo).HasColumnName("tipoaditivo").IsRequired().HasColumnType("varchar(50)");
            builder.Property(x => x.DataAssinatura).HasColumnName("dataassinaturaaditivo").IsRequired();
            builder.Property(x => x.DataValidade).HasColumnName("datavalidadeaditivo").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao").IsRequired(false);
            builder.Property(x => x.IdAditivo)
                   .HasColumnName("idaditivo")
                   .ValueGeneratedOnAdd()
                   .IsRequired();
        }
    }
}