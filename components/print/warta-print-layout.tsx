'use client'

import React from 'react'
import Image from 'next/image'
import DOMPurify from 'isomorphic-dompurify'
import { WartaDraftState } from '@/lib/types/warta-draft'
import { format, addDays, subDays } from 'date-fns'
import { id } from 'date-fns/locale'

interface WartaPrintLayoutProps {
  data: WartaDraftState
  pelayanLookup?: Record<string, string>
  keluargaLookup?: Record<string, string>
}

function Name(lookup: Record<string, string> | undefined, id: string | null): string {
  if (!id || !lookup) return '—'
  return lookup[id] ?? '—'
}

// Baris key-value dengan bullet manual (rata kiri-kanan secara vertikal).
function BulletKVRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start mb-[3px] text-[12px]">
      <span className="w-[4%] shrink-0 font-bold">•</span>
      <span className="w-[38%] shrink-0 font-medium pr-0.5">{label}</span>
      <span className="w-[4%] shrink-0 text-center">:</span>
      <span className="w-[54%] font-semibold break-words">{value}</span>
    </li>
  )
}

// Judul romawi dengan format rata kiri.
function SectionHeading({ title, dateLine }: { title: string; dateLine?: string }) {
  return (
    <div className="mt-1 mb-2 text-left">
      <div className="font-bold uppercase text-[13.5px] tracking-tight leading-tight">{title}</div>
      {dateLine && (
        <div className="font-bold uppercase text-[12px] tracking-tight leading-tight">{dateLine}</div>
      )}
    </div>
  )
}

export default function WartaPrintLayout({ data, pelayanLookup = {}, keluargaLookup = {} }: WartaPrintLayoutProps) {
  const safePengumuman = DOMPurify.sanitize(data.pengumumanHtml ?? '')

  let teksMinggu1 = "12 Juli 2026"
  let teksMinggu2 = "19 Juli 2026"
  let teksRabu1 = "08 Juli 2026"
  let teksRabu2 = "15 Juli 2026"

  if (data.tanggalIbadah) {
    try {
      const tglMinggu = new Date(data.tanggalIbadah)
      if (!isNaN(tglMinggu.getTime())) {
        teksMinggu1 = format(tglMinggu, 'dd MMMM yyyy', { locale: id })
        teksMinggu2 = format(addDays(tglMinggu, 7), 'dd MMMM yyyy', { locale: id })
        teksRabu1 = format(subDays(tglMinggu, 4), 'dd MMMM yyyy', { locale: id })
        teksRabu2 = format(addDays(tglMinggu, 3), 'dd MMMM yyyy', { locale: id })
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="w-[330mm] h-[210mm] max-h-[210mm] bg-white text-black p-2 mx-auto box-border flex flex-col font-serif overflow-hidden text-[10.5px] leading-[1.35]">

      {/* KOTAK HITAM UTAMA */}
      <div className="flex-1 min-h-0 w-full border-[3px] border-black flex flex-row overflow-hidden">

        {/* KOLOM KIRI */}
        <div className="w-[32%] flex-shrink-0 flex flex-col border-r-[2px] border-black p-2 overflow-hidden">

          {/* KOP SURAT */}
          <div className="flex items-center justify-between border-b-[4px] border-black mb-1.5 pb-1.5 text-center gap-1">
            <div className="flex-shrink-0 w-[54px]">
              <Image src="/logo-gkps.png" alt="Logo GKPS" width={48} height={48} className="object-contain w-full h-auto" unoptimized />
            </div>
            <div className="flex-1 px-0.5 leading-[1.15]">
              <p className="font-bold text-[13.5px] uppercase tracking-tight">Warta Jemaat</p>
              <p className="font-bold text-[13.5px] uppercase tracking-tight">GKPS Pamatang Simalungun</p>
              <p className="font-bold text-[11.5px] uppercase">Resort Siantar III</p>
              <p className="text-[8.5px] uppercase mt-0.5 font-normal">Jl. Guru Jason Saragih No.12</p>
              <p className="text-[8.5px] uppercase font-normal">Pamatang Simalungun</p>
            </div>
            <div className="flex-shrink-0 w-[54px]">
              <Image src="/logo-tema-gkps.png" alt="Logo Tema GKPS" width={54} height={54} className="object-contain w-full h-auto" unoptimized />
            </div>
          </div>

          {/* I. IBADAH MINGGU BERJALAN */}
          <SectionHeading title={`I. Kebaktian Minggu, ${teksMinggu1}`} />

          {/* KOTAK TEMA */}
          {data.tema_minggu && (
            <div className="flex justify-center mb-2">
              <div className="border border-black px-6 py-0.5">
                <p className="font-bold italic text-[15px]">&quot;{data.tema_minggu}&quot;</p>
              </div>
            </div>
          )}

          <ul className="list-none pl-0 mb-2">
            <BulletKVRow label="Goran Minggu"       value={data.goranMinggu || '—'} />
            <BulletKVRow label="Model Kebaktian"     value={data.modelKebaktian || '—'} />
            <BulletKVRow label="Warna Liturgi"       value={data.warnaLiturgi || '—'} />
            <BulletKVRow label="Ambilan"             value={data.ambilan || '—'} />
            <BulletKVRow label="Sibasaon"            value={data.sibasaon || '—'} />
            <BulletKVRow label="Par-Ambilan"         value={[Name(pelayanLookup, data.parAmbilan1Id), Name(pelayanLookup, data.parAmbilan2Id)].filter(v => v !== '—').join(' & ') || '—'} />
            <BulletKVRow label="Sipangidangi Pagi"   value={Name(pelayanLookup, data.sipangidangiPagiId)} />
            <BulletKVRow label="Sipangidangi Siang"  value={Name(pelayanLookup, data.sipangidangiSiangId)} />
            <BulletKVRow label="Par-Organ Pagi"      value={Name(pelayanLookup, data.parOrganPagiId)} />
            <BulletKVRow label="Par-Organ Siang"     value={Name(pelayanLookup, data.parOrganSiangId)} />
            {(data.parmasukPukul || []).length > 0 && (
              <BulletKVRow label="Parmasuk Pukul" value={(data.parmasukPukul || []).join(' & ') + ' WIB'} />
            )}
          </ul>

          {/* NOMOR DODING */}
          {(data.dodingItems || []).length > 0 && (
            <>
              <div className="font-bold uppercase text-[14px] text-center mb-1 tracking-tight">
                Nomor Doding
              </div>
              <div className="border border-black p-2 mb-2 text-[12px]">
                {(data.dodingItems || []).map((item, idx, arr) => {
                  const isProsesi = idx === 0
                  const isGalangan = idx === arr.length - 1

                  let leftContent
                  if (isProsesi) {
                    leftContent = <><b>Prosesi:</b> Hal No. {item.nomorLagu || '—'}</>
                  } else if (isGalangan) {
                    leftContent = <><b>Galangan:</b> Hal No. {item.nomorLagu || '—'}</>
                  } else {
                    leftContent = <span className="pl-4">{idx}. Hal No. {item.nomorLagu || '—'}</span>
                  }

                  return (
                    <div key={item.localId} className="flex items-start mb-[2.5px]">
                      <div className="flex-1 font-medium text-left pl-1">{leftContent}</div>
                      <div className="w-[4%] font-medium text-center">:</div>
                      <div className="w-[20%] font-bold text-left pl-1 whitespace-nowrap">
                        {item.notasiBait || '—'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* II. RINGKASAN MINGGU DEPAN */}
          <SectionHeading title={`II. Kebaktian Minggu, ${teksMinggu2}`} />
          <ul className="list-none pl-0">
            <BulletKVRow label="Model Kebaktian"     value={data.nextModelKebaktian || '—'} />
            <BulletKVRow label="Par-Ambilan"         value={[Name(pelayanLookup, data.nextParAmbilan1Id), Name(pelayanLookup, data.nextParAmbilan2Id)].filter(v => v !== '—').join(' / ') || '—'} />
            <BulletKVRow label="Sipangidangi Pagi"   value={Name(pelayanLookup, data.nextSipangidangiPagiId)} />
            <BulletKVRow label="Sipangidangi Siang"  value={Name(pelayanLookup, data.nextSipangidangiSiangId)} />
            <BulletKVRow label="Par-Organ Pagi"      value={Name(pelayanLookup, data.nextParOrganPagiId)} />
            <BulletKVRow label="Par-Organ Siang"     value={Name(pelayanLookup, data.nextParOrganSiangId)} />
            {(data.nextParmasukPukul || []).length > 0 && (
              <BulletKVRow label="Parmasuk Pukul" value={(data.nextParmasukPukul || []).join(' & ') + ' WIB'} />
            )}
          </ul>
        </div>

        {/* KOLOM TENGAH & KANAN (Otomatis mengalir) */}
        <div className="w-[68%] h-full flex-shrink-0 relative overflow-hidden">
          <div
            className="h-full columns-2 gap-x-4 px-2 py-1.5 [column-rule:2px_solid_black]"
            style={{ columnFill: 'auto', height: '100%' }}
          >
            {/* III. KEHADIRAN KEBAKTIAN MINGGU & PA */}
            <div className="break-inside-avoid-column mb-2">
              <SectionHeading title="III. Kehadiran Kebaktian Minggu & PA" />
              <table className="w-full border-collapse border border-black text-center table-fixed">
                <colgroup>
                  <col className="w-[7%]" />
                  <col className="w-[18%]" />
                  <col className="w-[44%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">No</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Tanggal</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Uraian</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Lk</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Pr</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Jlh Hadir</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.kehadiranItems || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="border border-black px-1 py-0.5 text-center italic">
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    (data.kehadiranItems || []).map((item, idx) => {
                      const jlh = (Number(item.lk) || 0) + (Number(item.pr) || 0)
                      return (
                        <tr key={item.localId}>
                          <td className="border border-black px-1 py-0.5">{idx + 1}</td>
                          <td className="border border-black px-1 py-0.5 whitespace-nowrap">{item.tanggal || '—'}</td>
                          <td className="border border-black px-1 py-0.5 text-left truncate">{item.uraian || '—'}</td>
                          <td className="border border-black px-1 py-0.5">{item.lk || 0}</td>
                          <td className="border border-black px-1 py-0.5">{item.pr || 0}</td>
                          <td className="border border-black px-1 py-0.5 font-bold whitespace-nowrap">{jlh} Halak</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* IV. KEHADIRAN PARTONGGOAN SEKTOR */}
            <div className="break-inside-avoid-column mb-2">
              <SectionHeading
                title="IV. Kehadiran Partonggoan Sektor"
                dateLine={`Rabu, ${teksRabu1}`}
              />
              <table className="w-full border-collapse border border-black text-center table-fixed">
                <colgroup>
                  <col className="w-[12%]" />
                  <col className="w-[48%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Sektor</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Ianan / Rumah</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Lk</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Pr</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Jlh Hadir</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.partonggoanKehadiran || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border border-black px-1 py-0.5 text-center italic">
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    (data.partonggoanKehadiran || []).map((item) => {
                      const jlh = (Number(item.lk) || 0) + (Number(item.pr) || 0)
                      return (
                        <tr key={item.localId}>
                          <td className="border border-black px-1 py-0.5 font-bold">{item.sektor}</td>
                          <td className="border border-black px-1 py-0.5 text-left truncate">{Name(keluargaLookup, item.keluargaId)}</td>
                          <td className="border border-black px-1 py-0.5">{item.lk || 0}</td>
                          <td className="border border-black px-1 py-0.5">{item.pr || 0}</td>
                          <td className="border border-black px-1 py-0.5 font-bold whitespace-nowrap">{jlh} Halak</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* V. JADWAL IANAN & SIPARTUGAS */}
            <div className="break-inside-avoid-column mb-2">
              <SectionHeading
                title="V. Ianan Partonggoan Pakon Sipartugas"
                dateLine={`Rabu, ${teksRabu2}`}
              />
              <table className="w-full border-collapse border border-black text-center table-fixed">
                <colgroup>
                  <col className="w-[13%]" />
                  <col className="w-[30%]" />
                  <col className="w-[30%]" />
                  <col className="w-[30%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Sektor</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Ianan / Rumah</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Par-Ambilan</th>
                    <th className="border border-black px-1 py-0.5 align-middle font-bold">Par-Agenda</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.partonggoanJadwal || []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="border border-black px-1 py-0.5 text-center italic">
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    (data.partonggoanJadwal || []).map((item) => (
                      <tr key={item.localId}>
                        <td className="border border-black px-1 py-0.5 align-top font-bold">
                          {item.sektor}
                        </td>
                        <td className="border border-black px-1 py-0.5 align-top text-left whitespace-normal break-words">
                          {Name(keluargaLookup, item.keluargaId)}
                        </td>
                        <td className="border border-black px-1 py-0.5 align-top text-left whitespace-normal break-words">
                          {Name(pelayanLookup, item.parAmbilanId)}
                        </td>
                        <td className="border border-black px-1 py-0.5 align-top text-left whitespace-normal break-words">
                          {Name(pelayanLookup, item.parAgendaId)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* VI. PENGUMUMAN */}
            <div>
              <div className="font-bold uppercase text-[13px] mb-1 tracking-tight">
                VI. Namasa Pakon Nasihol Sipamasaon
              </div>
              {safePengumuman ? (
                <div
                  className="
                    text-[11.8px] leading-[1.35] text-justify
                    [&_p]:mb-1 [&_p]:mt-0
                    [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-1 [&_ol]:space-y-0.5
                    [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-0.5
                    [&_li]:pl-0.5 [&_li]:mb-0.5
                    [&_li]:marker:font-bold
                    [&_strong]:font-bold [&_b]:font-bold
                  "
                  dangerouslySetInnerHTML={{ __html: safePengumuman }}
                />
              ) : (
                <p className="italic">Belum ada pengumuman.</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="shrink-0 pt-1 text-right">
        <p className="font-bold italic text-[10px]">PMJ GKPS PAMATANG SIMALUNGUN</p>
      </div>
    </div>
  )
}