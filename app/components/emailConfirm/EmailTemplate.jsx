import { formatDateWithDayName } from "@/app/utils/formatDates";
import React from "react";

export default function EmailTemplate({
  firstName,
  lastName,
  bookingNumber,
  checkInDate,
  checkOutDate,
  price,
  roomType,
  view,
  imageUrl,
}) {
  return (
    <div
      style={{
        direction: "rtl",
        fontFamily: '"Segoe UI", Tahoma, Arial, sans-serif',
        backgroundColor: "#f0f4f8",
        padding: "40px",
        color: "#333333",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header with gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #0057d8 0%, #00a5e0 100%)",
            padding: "32px 24px",
            color: "white",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              backgroundColor: "#ffcc00",
              color: "#333",
              borderRadius: "30px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            אושר!
          </div>

          <h1
            style={{
              fontSize: "28px",
              margin: "0 0 8px 0",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            ההזמנה שלך אושרה!
          </h1>
          <p style={{ fontSize: "16px", margin: 0, opacity: 0.9 }}>
            אנחנו מצפים לארח אותך במלון היוקרתי והמפנק שלנו
          </p>
        </div>

        {/* Content area */}
        <div style={{ padding: "32px 24px" }}>
          {/* Personal greeting */}
          <h2
            style={{
              color: "#0057d8",
              fontSize: "24px",
              marginTop: 0,
              marginBottom: "24px",
              fontWeight: "bold",
            }}
          >
            שלום {firstName} {lastName},
          </h2>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "32px",
            }}
          >
            תודה על הזמנתך! פרטי ההזמנה שלך מאושרים ואנו שמחים לארח אותך בקרוב.
            מצורפים כל הפרטים החשובים של ההזמנה שלך.
          </p>

          {/* Booking info card */}
          <div
            style={{
              backgroundColor: "#f8faff",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "32px",
              border: "1px solid #e6effd",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-12px",
                right: "24px",
                backgroundColor: "#0057d8",
                color: "white",
                borderRadius: "6px",
                padding: "6px 12px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              פרטי הזמנה
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "12px",
                  flexShrink: 0,
                }}
              >
                🎟️
              </div>
              <div>
                <p
                  style={{
                    margin: "0 0 2px 0",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  מספר הזמנה
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#0057d8",
                  }}
                >
                  {bookingNumber}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "12px",
                  flexShrink: 0,
                }}
              >
                📅
              </div>
              <div>
                <p
                  style={{
                    margin: "0 0 2px 0",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  תאריכי שהייה
                </p>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                  {formatDateWithDayName(checkInDate)} -{" "}
                  {formatDateWithDayName(checkOutDate)}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "12px",
                  flexShrink: 0,
                }}
              >
                🗺️
              </div>
              <div>
                <p
                  style={{
                    margin: "0 0 2px 0",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  מיקום
                </p>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                רחוב הים 123, תל אביב
                </p>
              </div>
            </div>

            <hr
              style={{
                border: "none",
                height: "1px",
                backgroundColor: "#e6effd",
                margin: "20px 0",
              }}
            />

            {/* תמונת החדר */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                הנה תמונה של החדר שלך:
              </p>

              <div style={{ textAlign: "center", width: "100%" }}>
                <img
                  src={imageUrl}
                  alt="Room Image"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            </div>

            {/* פרטי חדר ומחיר בשורות נפרדות */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "16px",
              }}
            >
              {/* נוף */}
              <div
                style={{
                  backgroundColor: "#f0f4f8",
                  padding: "16px",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  נוף
                </p>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                  {view}
                </p>
              </div>

              {/* סוג חדר */}
              <div
                style={{
                  backgroundColor: "#f0f4f8",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  סוג חדר
                </p>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                  {roomType}
                </p>
              </div>

              {/* מחיר */}
              <div
                style={{
                  backgroundColor: "#0057d8",
                  color: "white",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  padding: "16px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "14px",
                    color: "#ccc",
                  }}
                >
                  חשבונך חוייב על סך:
                </p>
                {price} ₪
              </div>
            </div>
          </div>

          {/* Important information */}
          <div
            style={{
              backgroundColor: "#fff8e6",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "32px",
              borderRight: "4px solid #ffcc00",
            }}
          >
            <h3
              style={{
                color: "#945700",
                fontSize: "18px",
                margin: "0 0 12px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "12px",
                  flexShrink: 0,
                }}
              >
               🕒  
              </div>
              
              פרטים חשובים
            </h3>
            <ul
              style={{
                margin: 0,
                paddingRight: "20px",
                color: "#333",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                קבלה (צ'ק-אין): החל מהשעה 15:00
              </li>
              <li style={{ marginBottom: "8px" }}>
                עזיבה (צ'ק-אאוט): עד השעה 11:00
              </li>
              <li>אם יש לך שאלות, אנא צור קשר עם צוות שירות הלקוחות שלנו.</li>
            </ul>
          </div>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "32px",
            }}
          >
            אנו מודים לך על שבחרת בנו ומצפים לארח אותך! אם יש לך שאלות כלשהן
            לגבי ההזמנה שלך, אל תהסס לפנות אלינו.
          </p>

          {/* Contact details - שיפור הפריסה */}
          <div
            style={{
              marginBottom: "32px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                margin: "0 0 16px 0",
                color: "#0057d8",
              }}
            >
              צור קשר
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f4f6f8",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "12px",
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: "24px" }}>✉️</div>
              </div>
                
                <p style={{ margin: 0, fontSize: "24px" }}>
                info@luxury-hotel.com
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#f4f6f8",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "12px",
                  flexShrink: 0,
                }}
              >
                <div style={{ fontSize: "24px" }}>📞</div>
              </div>
                
                <p style={{ margin: 0, fontSize: "24px" }}>03-1234567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#002a78",
            color: "white",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", opacity: 0.9 }}>
            © 2025 חברת ההזמנות. כל הזכויות שמורות.
          </p>
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>
            הודעת דוא"ל זו נשלחה אליך כדי לאשר את ההזמנה שלך.
          </p>
        </div>
      </div>
    </div>
  );
}
