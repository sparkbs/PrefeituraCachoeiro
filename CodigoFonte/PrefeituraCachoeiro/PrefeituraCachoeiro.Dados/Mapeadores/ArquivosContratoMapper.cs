using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ArquivosContratoMapper : IEntityTypeConfiguration<ArquivosContratosEntidade>
    {
        public void Configure(EntityTypeBuilder<ArquivosContratosEntidade> builder)
        {
            builder.ToTable("tb_arquivos_contratos").HasKey(i => i.Id);
            builder.Property(x => x.Id).HasColumnName("id").IsRequired();
            builder.Property(x => x.IdContratos).HasColumnName("idcontrato").IsRequired(true);
            builder.Property(x => x.ArquivoContrato).HasColumnName("arquivocontrato").IsRequired(true).HasColumnType("varchar(5000)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired(true);
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao").IsRequired(false);

            builder.Property(x => x.Id)
                   .HasColumnName("id")
                   .ValueGeneratedOnAdd()
                   .IsRequired(true);

            builder.HasOne(x => x.Contratos)
                   .WithMany(x => x.ArquivosContratos)
                   .HasForeignKey(x => x.IdContratos)
                   .HasConstraintName("fk_arquivos_contratos");
        }
    }
}