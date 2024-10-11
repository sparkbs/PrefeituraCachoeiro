using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class OrigemEntidadeMapper : IEntityTypeConfiguration<OrigemEntidade>
    {
        public void Configure(EntityTypeBuilder<OrigemEntidade> builder)
        {
            builder.ToTable("tb_origem").HasKey(i => i.IdOrigem);
            builder.Property(x => x.IdOrigem).HasColumnName("idorigem").IsRequired();
            builder.Property(x => x.Nome).HasColumnName("nome").IsRequired().HasColumnType("varchar(50)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
        }
    }
}