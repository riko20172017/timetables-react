'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { useEffect, useState } from 'react'

export default function Home() {

  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [teacherId, setTeacherId] = useState(true)

  useEffect(() => {
    fetch('/database.json')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  console.log(data?.timetable)

  function handleSelect(e) {
    setTeacherId(e.target.value);
  }

  const timetable = []

  data?.timetable?.card?.map((card, i) => {
    // -classids
    // -classroomids
    // -day
    // -period
    // -subjectid
    // -teacherids

    if (card["-teacherids"] == teacherId) {

      const classroomids = card["-classroomids"]
      const teacherids = card["-teacherids"]
      const subjectid = card["-subjectid"]
      const classids = card["-classids"]
      const period = card["-period"]
      const day = card["-day"]


      const classrooom = data?.timetable?.classroom?.find(classroom => classroom["-id"] == classroomids)
      const subject = data?.timetable?.subject?.find(subject => subject["-id"] == subjectid)
      const clas = data?.timetable?.class?.find(clas => clas["-id"] == classids)

      timetable.push({ classrooom: classrooom["-name"], subject: subject["-name"], clas: clas["-name"], day, period })
    }
  })

  timetable.sort((a, b) => parseInt(a.period) - parseInt(b.period))
  timetable.sort((a, b) => parseInt(a.day) - parseInt(b.day))


  return (

    <main className={styles.main}>
      <select defaultValue="" onChange={handleSelect} className={styles.select}>
        <option value="">Выберите</option>

        {data?.timetable?.teacher.map((t, i) => {
          return <option
            key={i}
            value={t["-id"]}>{t["-name"]}</option>
        })}
      </select>

      <div className={styles.description}>
        <ul>
          {timetable.map((card) => <li>{card.subject} {card.clas} {card.classrooom}</li>)}
        </ul>
      </div>
    </main>
  )
}
