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

  let timetable = []

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

      timetable.push({
        classrooom: classrooom["-name"],
        subject: subject["-name"],
        period: parseInt(period),
        clas: clas["-name"],
        day: parseInt(day),
      })
    }
  })
  timetable = timetable
    .sort((a, b) => a.period - b.period)
    .sort((a, b) => a.day - b.day)
    .map((card, i, table) => {
      // Проверка, Если это не последний элемент массива
      if (i + 1 !== table.length) {
        // Если это четное, т.е. 1 урок пары
        if (card.period % 2) {
          let nextCard = table[i + 1];
          if ((nextCard.subject == card.subject) && (nextCard.class == card.class)) {
            card.endPeriod = 2
          }
          else {
            card.endPeriod = 1
          }
        }
        else {
          let previosCard = table[i - 1];
          if (previosCard.endPeriod == 2) {
            card.endPeriod = 0
          }
          else {
            card.endPeriod = 1
          }
        }
      }
      else {
        let previosCard = table[i - 1];
        if (previosCard.endPeriod == 2) {
          card.endPeriod = 0
        }
        else {
          card.endPeriod = 1
        }
      }
      return card
    })
    .filter((card, i, table) => {
      if (card.endPeriod == 0) {
        return false
      }
      else {
        return true
      }
    })

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
        <ul className={styles.table}>
          {timetable.map((card, i) => {
            return <li
              className={styles.card}
              key={i + "card"}
              style={{
                "gridArea":
                  `${card.period} / ${card.day + 1} / span ${card.endPeriod} / span 1`
              }}
            >
              <span className={styles.span}>{card.subject}</span>
              <span>{card.clas}</span>
              <span>{card.classrooom}</span>
            </li>
          })}
        </ul>
      </div>
    </main>
  )
}
