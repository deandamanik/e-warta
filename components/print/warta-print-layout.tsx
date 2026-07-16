'use client'

import React from 'react'
import Image from 'next/image'
import DOMPurify from 'isomorphic-dompurify'
import { WartaDraftState } from '@/lib/types/warta-draft'

interface WartaPrintLayoutProps {
  data: WartaDraftState
  pelayanLookup?: Record<string, string>
  keluargaLookup?: Record<string, string>
}

function Name(lookup: Record<string, string> | undefined, id: string | null): string {
  if (!id || !lookup) return '—'
  return lookup[id] ?? '—'
}

// Baris key-value dengan BULLET manual (bukan ::marker bawaan <li>, karena
// marker akan hilang saat <li> diberi display:flex di banyak render engine/print).
// Bullet, label, dan titik dua semuanya kolom fixed-width -> titik dua selalu
// rata dalam satu garis vertikal berapapun panjang labelnya.
function BulletKVRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start mb-[1.5px]">
      <span className="w-[3%] shrink-0 font-bold">•</span>
      <span className="w-[39%] shrink-0 font-medium pr-0.5">{label}</span>
      <span className="w-[4%] shrink-0 text-center">:</span>
      <span className="w-[54%] font-semibold break-words">{value}</span>
    </li>
  )
}

// Judul Romawi. `align` mengikuti gambar: I, II, VI = rata kiri. III, IV, V = center.
// `dateLine` opsional untuk baris tanggal kedua (statis dulu, sesuai instruksi).
function SectionHeading({
  title,
  dateLine,
  align = 'left',
}: {
  title: string
  dateLine?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={`mb-1 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <div className="font-bold uppercase text-[11px] tracking-tight leading-tight">{title}</div>
      {dateLine && (
        <div className="font-bold uppercase text-[11px] tracking-tight leading-tight">{dateLine}</div>
      )}
    </div>
  )
}

export default function WartaPrintLayout({ data, pelayanLookup = {}, keluargaLookup = {} }: WartaPrintLayoutProps) {
  const safePengumuman = DOMPurify.sanitize(data.pengumumanHtml ?? '')

  return (
    <div className="w-[297mm] h-[210mm] max-h-[210mm] bg-white text-black p-3 mx-auto box-border flex flex-col font-serif overflow-hidden text-[10px] leading-[1.25]">
      {/* KOTAK HITAM UTAMA */}
      <div className="flex-1 w-full border-[3px] border-black flex flex-row overflow-hidden">

        {/* =================== KOLOM 1 — KIRI (I, Nomor Doding, II) =================== */}
        <div className="w-[31%] flex-shrink-0 flex flex-col border-r-[3px] border-black p-2 overflow-hidden">

          {/* KOP SURAT */}
          <div className="flex items-center justify-between border-b-[3px] border-black mb-1.5 pb-1.5 text-center gap-1">
            <div className="flex-shrink-0 w-[42px]">
              <Image src="/logo-gkps.png" alt="Logo GKPS" width={42} height={42} className="object-contain w-full h-auto" />
            </div>
            <div className="flex-1 px-0.5 leading-[1.15]">
              <p className="font-bold text-[13px] uppercase tracking-tight">Warta Jemaat</p>
              <p className="font-bold text-[13px] uppercase tracking-tight">GKPS Pamatang Simalungun</p>
              <p className="font-bold text-[11px] uppercase">Resort Siantar III</p>
              <p className="text-[8px] uppercase mt-0.5 font-normal">Jl. Guru Jason Saragih No.12</p>
              <p className="text-[8px] uppercase font-normal">Pamatang Simalungun</p>
            </div>
            <div className="flex-shrink-0 w-[42px]">
              <Image src="/logo-tema-gkps.png" alt="Logo Tema GKPS" width={42} height={42} className="object-contain w-full h-auto" />
            </div>
          </div>

          {/* I. IBADAH MINGGU BERJALAN */}
          {/* Tanggal masih statis (placeholder) — ganti dengan field data jika sudah tersedia */}
          <SectionHeading title="I. Kebaktian Minggu, 12 Juli 2026" align="left" />

          {/* KOTAK TEMA (mis. "Marsiurupan") */}
          <div className="flex justify-center mb-1.5">
            <div className="border border-black px-6 py-0.5">
              <p className="font-bold italic text-[11px]">Marsiurupan</p>
            </div>
          </div>

          <ul className="list-none pl-0 mb-2">
            <BulletKVRow label="Goran Minggu"       value={data.goranMinggu || '—'} />
            <BulletKVRow label="Model Kebaktian"     value={data.modelKebaktian || '—'} />
            <BulletKVRow label="Warna Liturgi"       value={data.warnaLiturgi || '—'} />
            <BulletKVRow label="Ambilan"             value={data.ambilan || '—'} />
            <BulletKVRow label="Sibasaon"            value={data.sibasaon || '—'} />
            <BulletKVRow label="Par-Ambilan"         value={[Name(pelayanLookup, data.parAmbilan1Id), Name(pelayanLookup, data.parAmbilan2Id)].filter(v => v !== '—').join(' / ') || '—'} />
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
              <div className="font-bold uppercase text-[11px] text-center mb-1 tracking-tight">
                Nomor Doding
              </div>
              <div className="border border-black p-2 mt-1 mb-2">
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
                    <div key={item.localId} className="flex justify-between items-center mb-[1px]">
                      <div className="font-medium text-left">{leftContent}</div>
                      <div className="font-medium text-right pl-2 whitespace-nowrap">
                        : <b>{item.notasiBait || '—'}</b>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* II. RINGKASAN MINGGU DEPAN */}
          <SectionHeading title="II. Kebaktian Minggu, 19 Juli 2026" align="left" />
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

        {/* =================== KOLOM 2 + 3 — MULTI-COLUMN FLOW (III, IV, V, VI) =================== */}
        {/* Wrapper ini merepresentasikan gabungan kolom tengah+kanan. Kontennya
            mengalir otomatis: III, IV, V mengisi kolom tengah (masing-masing
            'break-inside-avoid-column' agar tabel tidak terpotong di tengah),
            lalu VI dimulai di kolom tengah dan sisanya otomatis meluber ke
            kolom kanan berkat CSS `columns-2` + `column-fill: auto`. */}
        <div className="w-[69%] flex-shrink-0 relative overflow-hidden">
          <div
            className="h-full columns-2 gap-x-4 px-2 py-1.5 [column-fill:auto] [column-rule:3px_solid_black]"
          >
            {/* III. KEHADIRAN KEBAKTIAN MINGGU & PA */}
            <div className="break-inside-avoid-column mb-2">
              <SectionHeading title="III. Kehadiran Kebaktian Minggu & PA" align="center" />
              <table className="w-full border-collapse border border-black text-center table-fixed">
                <colgroup>
                  <col className="w-[6%]" />
                  <col className="w-[16%]" />
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
                dateLine="Rabu, 08 Juli 2026"
                align="center"
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
                dateLine="Rabu, 15 Juli 2026"
                align="center"
              />
              <table className="w-full border-collapse border border-black text-center table-fixed">
                <colgroup>
                  <col className="w-[10%]" />
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
                        <td className="border border-black px-1 py-0.5 font-bold">{item.sektor}</td>
                        <td className="border border-black px-1 py-0.5 text-left truncate">{Name(keluargaLookup, item.keluargaId)}</td>
                        <td className="border border-black px-1 py-0.5 text-left truncate">{Name(pelayanLookup, item.parAmbilanId)}</td>
                        <td className="border border-black px-1 py-0.5 text-left truncate">{Name(pelayanLookup, item.parAgendaId)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* VI. PENGUMUMAN — sengaja TIDAK diberi break-inside-avoid-column,
                supaya boleh terpotong dan mengalir dari kolom tengah ke kolom kanan */}
            <div>
              <div className="font-bold uppercase text-[11px] mb-1 tracking-tight">
                VI. Namasa Pakon Nasihol Sipamasaon
              </div>
              {safePengumuman ? (
                <div
                  className="
                    text-[9.5px] leading-[1.3] text-justify
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

          {/* FOOTER (PMJ) — diposisikan absolute di pojok kanan-bawah area
              kolom 2+3, karena flex `mt-auto` tidak berlaku di dalam CSS
              multi-column (setiap kolom adalah fragment, bukan flex item). */}
          <div className="absolute bottom-1 right-2 bg-white pl-2">
            <p className="font-bold italic text-[11px]">PMJ GKPS PAMATANG SIMALUNGUN</p>
          </div>
        </div>

      </div>
    </div>
  )
}