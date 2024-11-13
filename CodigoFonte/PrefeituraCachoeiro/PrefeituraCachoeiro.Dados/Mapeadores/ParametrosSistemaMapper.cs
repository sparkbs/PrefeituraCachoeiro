using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ParametrosSistemaMapper : IEntityTypeConfiguration<ParametrosSistemaEntidade>
    {
        public void Configure(EntityTypeBuilder<ParametrosSistemaEntidade> builder)
        {
            builder.ToTable("tb_parametros_sistema").HasKey(i => i.Id);
            builder.Property(x => x.Id).HasColumnName("id").IsRequired();
            builder.Property(x => x.EmailFinanceiro).HasColumnName("emailfinanceiro").IsRequired(false).HasColumnType("varchar(500)");

            builder.Property(x => x.Id)
                   .HasColumnName("id")
                   .ValueGeneratedOnAdd()
                   .IsRequired(true);
        }
    }
}