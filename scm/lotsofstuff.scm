(define atom?
  (lambda (x)
    (not (list? x))))

(define lat? (lambda (x)
  (cond
    ((null? x) #t)
    ((atom? (car x)) (lat? (cdr x)))
    (else #f)
  )
)
)

(define or? (lambda (c1 c2)
  (cond
    ((eq? c1 #t) #t)
    ((eq? c2 #t) #t)
    (else #f)
  )
)
)


(define remberAll
  (lambda (atm lat)
    (cond
      ((null? lat) lat)
      ((eq? (car lat) atm) (remberAll atm (cdr lat)))
      (else (cons (car lat) (remberAll atm (cdr lat))))
    )
  )
)

(define rember
  (lambda (atm lat)
    (cond
      ((null? lat) lat)
      ((eq? (car lat) atm) (cdr lat))
      (else (cons (car lat) (rember atm (cdr lat))))
    )
  )
)

(define firsts
  (lambda (lst)
    (cond
      ((null? lst) lst)
      (else (cons (car (car lst)) (firsts (cdr lst))))))
    )
(define seconds
  (lambda (lst)
    (cond
      ((null? lst) lst)
      (else (cons (car (cdr (car lst))) (seconds (cdr lst))))))
    )

(define insertR
  (lambda (new old lat)
    (cond
      ((null? lat) lat)
      ((eq? (car lat) old) (cons old (cons new (cdr lat))))
      (else (cons (car lat) (insertR new old (cdr lat))))
    )
  )
)

(define insertL
  (lambda (new old lat)
    (cond
      ((null? lat) lat)
      ((eq? (car lat) old) (cons new lat))
      (else (cons (car lat) (insertL new old (cdr lat))))
    )
  )
)

(define subst
  (lambda (new old lat)
    (cond
      ((null? lat) lat)
      ((eq? (car lat) old) (cons new (cdr lat)))
      (else (cons (car lat) (subst new old (cdr lat))))
    )
  )
)

(define subst2
  (lambda (new o1 o2 lat)
    (cond
      ((null? lat) lat)
      ((or (eq? (car lat) o1) (eq? (car lat) o2)) (cons new (cdr lat)))
      (else (cons (car lat) (subst2 new o1 o2 (cdr lat))))
    )
  )
)

(define multiinsertR
  (lambda (new old lat)
    (cond
      ((null? lat) lat)
      ((eq? (car lat) lat) (cons old (cons new (multiinsertR new old (cdr lat)))))
      (else (cons (car lat) (multiinsertR new old (cdr lat))))
    )
  )
)

(rember "bosse" (list "kalas" "bosse" "apa"))