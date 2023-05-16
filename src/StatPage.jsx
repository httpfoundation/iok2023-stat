/* import styled from "styled-components" */
import  { useGetAll} from "./tools/datoCmsTools"
import { CSVExportLink, getRegistrationsForExport, AttendancesCSVExportLink } from "./CSVExportLink"

const StatPage = () => {
	
	const stages = useGetAll("stage")
	const registrations = useGetAll("registration")
	console.log("registrations", registrations)
	const attendances = useGetAll("attendance") ?? []
	const attendancesWithRegistration = attendances.map((attendance) => {
		const registration = registrations.find((registration) => registration.id === attendance.registration)
		return {...attendance, registrationDetails: registration}
	})
	console.log("attendances", attendancesWithRegistration)
		const onsite = registrations.filter(r => r.onsite)
	const online = registrations.filter(r => (!(r.onsite)))
	
	const registrationsForExport = getRegistrationsForExport(registrations) ?? []
	
	const numberOfRegistrationFeedback = registrationsForExport.filter((registration) => registration.registrationFeedback ).length
	const numberOfTranslation = registrationsForExport.filter((registration) => (registration.translation)  ).length
	const numberOfCancellation = registrationsForExport.filter((registration) => (registration.registrationFeedback) &&  (!registration.onsite)).length

	const breakoutSessions = (stages.map(stage => {
		const regs = registrations?.filter((reg) => reg.stage===`${stage.id}`)
		return {name: stage.name, numberOfRegistration: regs.length}
	}))
	
	const onsiteBreakoutSessions = breakoutSessions.filter(bs => bs.numberOfRegistration>0)


	return (
		<>
			<div>Összes regisztráció: {registrations?.length}</div>
			<div>Regisztráció online részvételre: {online?.length}</div>
			<div>Regisztráció helyszíni részvételre: {onsite?.length ?? "0"}</div>
			<div>&nbsp;</div>
			{onsiteBreakoutSessions?.map((breakoutSession) => <div>{breakoutSession.name}: {breakoutSession.numberOfRegistration} </div> )}
			<div>&nbsp;</div>
			<div>Helyszíni résztvevő visszajelzés: {numberOfRegistrationFeedback}</div>
			<div>Ebből ennyi a lemondás: {numberOfCancellation}</div>
			<div>Tolmácsolást kér: {numberOfTranslation}</div>
			<CSVExportLink registrations={registrations} fileName="iok2023_jelentkezesek.csv" buttonTitle="Regisztráltak exportálása CSV fájlba" />
			<AttendancesCSVExportLink attendances={attendancesWithRegistration} fileName="iok2023_latogatasi_adatok.csv" buttonTitle="Látogatási adatok exportálása CSV fájlba" />
		</>
	)
}



export default StatPage