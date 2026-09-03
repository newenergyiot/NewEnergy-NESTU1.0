const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Resend } = require("resend");

admin.initializeApp();
const db = admin.database();

const resend = new Resend(functions.config().resend.key);

exports.verificarTemperatura = functions.database.ref("/sensores/{sensorId}/temp")
    .onCreate(async (snapshot, context) => {
        const sensorId = context.params.sensorId;
        const tempAtual = snapshot.val();

        const configSnapshot = await db.ref(`central_sensores/${sensorId}`).once("value");
        if (!configSnapshot.exists()) return null;

        const config = configSnapshot.val();
        const { tempMin, tempMax, emailAlerta, nome } = config;

        if (!emailAlerta) return null;

        let alerta = false;
        let mensagem = "";
        const nomeSensor = nome ? nome : sensorId;

        if (tempMin !== null && tempMin !== undefined && tempAtual < tempMin) {
            alerta = true;
            mensagem = `O sensor <b>${nomeSensor}</b> registrou <b>${tempAtual}°C</b>, ficando abaixo do limite mínimo de <b>${tempMin}°C</b>.`;
        } else if (tempMax !== null && tempMax !== undefined && tempAtual > tempMax) {
            alerta = true;
            mensagem = `O sensor <b>${nomeSensor}</b> registrou <b>${tempAtual}°C</b>, ultrapassando o limite máximo de <b>${tempMax}°C</b>.`;
        }

        if (alerta) {
            try {
                await resend.emails.send({
                    from: 'Alerta NewEnergy <onboarding@resend.dev>',
                    to: emailAlerta,
                    subject: `[Alerta Crítico] Temperatura - ${nomeSensor}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                            <h2 style="color: #d9534f;">Alerta de Temperatura</h2>
                            <p>${mensagem}</p>
                            <hr style="border: none; border-top: 1px solid #eee;" />
                            <p style="font-size: 12px; color: #666;">Sistema de Monitoramento NewEnergy</p>
                        </div>
                    `
                });
                console.log(`E-mail enviado com sucesso para ${emailAlerta}`);
            } catch (error) {
                console.error("Erro ao enviar e-mail pelo Resend:", error);
            }
        }

        return null;
    });
