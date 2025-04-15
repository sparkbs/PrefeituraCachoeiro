using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ArquivosAditivoMapper : IEntityTypeConfiguration<ArquivosAditivoEntidade>
    {
        public void Configure(EntityTypeBuilder<ArquivosAditivoEntidade> builder)
        {
            builder.ToTable("tb_arquivos_aditivo").HasKey(i => i.Id);
            builder.Property(x => x.Id).HasColumnName("id").IsRequired();
            builder.Property(x => x.IdAditivo).HasColumnName("idaditivo").IsRequired(true);
            builder.Property(x => x.ArquivoAditivo).HasColumnName("arquivo").IsRequired(true).HasColumnType("varchar(5000)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired(true);
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao").IsRequired(false);

            builder.Property(x => x.Id)
                   .HasColumnName("id")
                   .ValueGeneratedOnAdd()
                   .IsRequired(true);

            builder.HasOne(x => x.Aditivos)
                   .WithMany(x => x.ArquivosAditivos)
                   .HasForeignKey(x => x.IdAditivo)
                   .HasConstraintName("fk_arquivos_aditivos");
        }
    }
}